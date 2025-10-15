// 作品内容加载器
class WorkLoader {
    constructor() {
        this.workData = {};
    }

    // 从txt文件读取内容
    async loadSummaryFromFile(cardNumber) {
        try {
            const response = await fetch(`work-source/WorksDescription/Card${cardNumber}/summary.txt?t=${Date.now()}`);
            if (response.ok) {
                const content = await response.text();
                
                // 解析 title="..." 和 text="..." 格式
                const titleMatch = content.match(/title="([^"]*)"/);
                const textMatch = content.match(/text="([^"]*)"/);
                
                const title = titleMatch ? titleMatch[1] : 'No Title';
                const description = textMatch ? textMatch[1] : 'No Description';
                
                return { title, description };
            }
        } catch (error) {
            console.warn(`Could not load summary for Card${cardNumber}:`, error);
        }
        return { title: 'No Title', description: 'No Description' };
    }

    // 检查图片是否存在
    checkImageExists(imagePath) {
        return new Promise((resolve) => {
            try {
                const img = new Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = imagePath;
            } catch (error) {
                resolve(false);
            }
        });
    }

    // 加载作品内容
    async loadWorkContent(cardNumber) {
        try {
            const imageElement = document.getElementById(`workImage${cardNumber}`);
            
            // 先隐藏图片
            imageElement.style.display = 'none';
            
            // 从文件读取内容
            const { title, description } = await this.loadSummaryFromFile(cardNumber);
            console.log(`Card${cardNumber} loaded from file:`, { title, description });
            
            // 尝试加载图片
            const imagePath = `work-source/WorksDescription/Card${cardNumber}/Card${cardNumber}Image.png`;
            const imageExists = await this.checkImageExists(imagePath);
            if (imageExists) {
                imageElement.src = imagePath;
                imageElement.style.display = 'block';
            }

            // 设置文本内容
            document.getElementById(`workTitle${cardNumber}`).textContent = title;
            document.getElementById(`workDescription${cardNumber}`).textContent = description;

        } catch (error) {
            console.error('Error loading work content:', error);
            this.setDefaultContent(cardNumber);
        }
    }

    // 设置默认内容
    setDefaultContent(cardNumber) {
        document.getElementById(`workTitle${cardNumber}`).textContent = 'No Description';
        document.getElementById(`workDescription${cardNumber}`).textContent = 'No Description';
    }

    // 更新作品数据（用于动态更新内容）
    updateWorkData(cardNumber, newData) {
        if (this.workData[cardNumber]) {
            Object.assign(this.workData[cardNumber], newData);
        } else {
            this.workData[cardNumber] = newData;
        }
    }

    // 重新加载作品内容
    reloadWorkContent(cardNumber) {
        this.loadWorkContent(cardNumber);
    }
}

// 创建全局实例
window.workLoader = new WorkLoader();
